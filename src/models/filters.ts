import { Location } from "./location";

export interface Filters {
    breeds?: string[];
    zipCodes?: string[];
    locations?: Location[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    sort?: string;
    from?: number;
}