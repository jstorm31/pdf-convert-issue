'use client';

import ky from 'ky';
import { useState } from 'react';
import { Dropzone } from './Dropzone';
import { ReportCropper } from './ReportCropper';
import classes from './UploadProcess.module.css';

export function UploadProcess() {
    const [isUploading, setIsUploading] = useState(false);
    const [image, setImage] = useState<File>();
    const [croppedImage, setCroppedImage] = useState<File>();

    const convertPdfToImage = async (file: File) => {
        setIsUploading(true);
        const data = new FormData();
        data.set('file', file);

        try {
            const blob = await ky.post('/api/v1/convert', { body: data }).blob();
            return new File([blob], 'report.png', { type: 'image/png' });
        } catch (error) {
            console.log(error, 'Converting pdf to image has failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={classes.container}>
            <section>
                {!image && (
                    <Dropzone
                        loading={isUploading}
                        onDrop={async (files) => {
                            const file = files[0]!;

                            if (file.type === 'application/pdf') {
                                const imageFile = await convertPdfToImage(file);
                                setImage(imageFile);
                            } else {
                                setImage(file);
                            }
                        }}
                    />
                )}

                {!croppedImage && image && <ReportCropper image={image} onSubmit={setCroppedImage} />}
            </section>
        </div>
    );
}
