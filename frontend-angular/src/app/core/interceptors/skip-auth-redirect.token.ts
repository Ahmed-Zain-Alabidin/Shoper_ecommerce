import { HttpContextToken } from '@angular/common/http';

/** Skip global 401 logout redirect (e.g. background cart sync). */
export const SKIP_AUTH_REDIRECT = new HttpContextToken<boolean>(() => false);
