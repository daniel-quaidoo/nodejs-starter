export class CreateMediaContractDto {
    mediaName: string;
    mediaType: string;
    contentUrl: string;
    isThumbnail: boolean;
    caption: string | null;
    description: string | null;
    entityId: string;
    entityType: string;
    uploadedBy: string;
    uploadedAt: Date;
    mediaAlias: string;
}
