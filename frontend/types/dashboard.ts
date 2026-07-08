export interface Farm {

    id: number;

    farm_name: string;

    latitude: number;

    longitude: number;

    area: number;

    crop_name?: string;

    prediction?: number;

}