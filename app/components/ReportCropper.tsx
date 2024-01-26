import { Alert, Button, Flex, List, ListItem, Stack, Text, Title } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export function ReportCropper({
    image,
    onSubmit,
    reset,
}: {
    image: File;
    onSubmit?: (file: File) => void;
    reset?: () => void;
}) {
    const [crop, setCrop] = useState<Crop>();
    const [imageUrl, setImageUrl] = useState<string>();
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        let fileReader: FileReader;
        let isCancel = false;

        if (image) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                if (e.target?.result && !isCancel) {
                    setImageUrl(e.target.result as string);
                }
            };
            fileReader.readAsDataURL(image);
        }
        return () => {
            isCancel = true;
            if (fileReader?.readyState === 1) {
                fileReader.abort();
            }
        };
    }, [image]);

    function onSubmitCrop() {
        if (!crop) {
            onSubmit?.(image);
            return;
        }

        // create a canvas element to draw the cropped image
        const canvas = document.createElement('canvas');

        // draw the image on the canvas
        if (imgRef.current) {
            const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
            const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
            const ctx = canvas.getContext('2d');
            const pixelRatio = window.devicePixelRatio;
            canvas.width = crop.width * pixelRatio * scaleX;
            canvas.height = crop.height * pixelRatio * scaleY;

            if (ctx) {
                ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                ctx.imageSmoothingQuality = 'high';

                ctx.drawImage(
                    imgRef.current,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width * scaleX,
                    crop.height * scaleY
                );
            }

            const base64Image = canvas.toDataURL(image.type);
            // const base64Image = canvas.toDataURL('image/png'); // can be changed to jpeg/jpg etc

            if (base64Image) {
                const fileType = base64Image.split(';')[0].split(':')[1];

                const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
                const file = new File([buffer], image.name, { type: fileType });
                onSubmit?.(file);
            }
        }
    }

    return (
        <>
            <Stack mb="xl">
                <Title order={3}>Ořezání</Title>
                <Text>Zprávu ořežte tak, aby:</Text>
                <List>
                    <ListItem>obsahovala pouze podstatné části (typicky diagnózu, doporučenou léčbu, závěr)</ListItem>
                    <ListItem>
                        neobsahovala <b>osobní údaje</b> v záhlaví.
                    </ListItem>
                </List>
                <Alert icon={<IconInfoCircle />}>
                    Ořezaná zpráva bude vysvětlena <b>rychleji a detailněji</b>.
                </Alert>
            </Stack>

            <Stack gap="xl">
                {imageUrl && (
                    <ReactCrop
                        crop={
                            crop ?? {
                                x: 0,
                                y: 0,
                                width: 100,
                                height: 100,
                                unit: '%',
                            }
                        }
                        onChange={(c) => {
                            setCrop(c);
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imageUrl} alt="" ref={imgRef} />
                    </ReactCrop>
                )}

                <Flex gap="md">
                    <Button radius="xl" onClick={onSubmitCrop}>
                        Ořezat zprávu
                    </Button>
                    {reset && (
                        <Button radius="xl" variant="default" onClick={reset}>
                            Zrušit
                        </Button>
                    )}
                </Flex>
            </Stack>
        </>
    );
}
