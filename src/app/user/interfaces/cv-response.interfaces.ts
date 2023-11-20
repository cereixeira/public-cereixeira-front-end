
export interface MetadataCvResponse {
  id: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentCvResponse extends MetadataCvResponse{
  document: string;
}
