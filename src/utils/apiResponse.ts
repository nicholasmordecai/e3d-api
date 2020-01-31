import { AuthResponse } from './responses/authResponse';
import { GeneralResponse } from './responses/generalResponse';

export const Respond = {
    Auth: AuthResponse,
    success: GeneralResponse.success,
};
