'use client';

import { Button, Group, Loader, Stack, Text, rem, useMantineTheme } from '@mantine/core';
import { FileWithPath, IMAGE_MIME_TYPE, Dropzone as MantineDropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { useRef } from 'react';
import classes from './Dropzone.module.css';

interface DropzoneProps {
    loading?: boolean;
    onDrop: (files: FileWithPath[]) => void;
}

export function Dropzone({ onDrop, loading }: DropzoneProps) {
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);

    return (
        <>
            <div className={classes.wrapper}>
                <MantineDropzone
                    openRef={openRef}
                    onDrop={onDrop}
                    className={classes.dropzone}
                    radius="md"
                    accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE]}
                    maxSize={5 * 1024 ** 2}
                    maxFiles={1}
                    name="file"
                    disabled={loading}
                >
                    <div style={{ pointerEvents: 'none' }}>
                        {!loading ? (
                            <>
                                <Group justify="center">
                                    <MantineDropzone.Accept>
                                        <IconDownload
                                            style={{ width: rem(50), height: rem(50) }}
                                            color={theme.colors.blue[6]}
                                            stroke={1.5}
                                        />
                                    </MantineDropzone.Accept>
                                    <MantineDropzone.Reject>
                                        <IconX
                                            style={{ width: rem(50), height: rem(50) }}
                                            color={theme.colors.red[6]}
                                            stroke={1.5}
                                        />
                                    </MantineDropzone.Reject>
                                    <MantineDropzone.Idle>
                                        <IconCloudUpload style={{ width: rem(50), height: rem(50) }} stroke={1.5} />
                                    </MantineDropzone.Idle>
                                </Group>
                                <Text ta="center" fw={700} fz="lg">
                                    <MantineDropzone.Accept>
                                        Upload PDF
                                    </MantineDropzone.Accept>
                                    <MantineDropzone.Reject>Maximální velikost je 5 MB</MantineDropzone.Reject>
                                    <MantineDropzone.Idle>Upload PDF</MantineDropzone.Idle>
                                </Text>
                                <Text ta="center" fz="sm" mt="xs" c="dimmed">
Drag & drop PDF
                                </Text>
                            </>
                        ) : (
                            <Stack align="center" gap="xs">
                                <Loader type="dots" color="primary" />
                                <Text size="md">Nahrávání zprávy</Text>
                            </Stack>
                        )}
                    </div>
                </MantineDropzone>

                <Button
                    className={classes.control}
                    radius="xl"
                    size="md"
                    disabled={loading}
                    onClick={() => openRef.current?.()}
                >
                    Chose file
                </Button>
            </div>
        </>
    );
}
