export interface GenerationRequestEvent {
    id?: string;
    userId?: string;
    prompt?: string;
    [key: string]: unknown;
}
export declare class AppService {
    private readonly analyticsEndpoint;
    getHello(): string;
    trackGenerationRequest(event: GenerationRequestEvent): Promise<void>;
}
