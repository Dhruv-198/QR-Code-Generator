export type QRCodeType = 'url' | 'email' | 'phone';

export interface QRCodeData {
  id: string;
  type: QRCodeType;
  originalData: string;
  qrCodeImage: string;
  createdAt: string;
}

export interface QRCodeGenerateRequest {
  type: QRCodeType;
  data: string;
}

export interface QRCodeResponse {
  success: boolean;
  message: string;
  data?: QRCodeData;
  error?: string;
}

export interface QRCodeHistoryResponse {
  success: boolean;
  data?: {
    qrCodes: QRCodeData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}