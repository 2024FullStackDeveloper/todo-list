import { PromiseResult } from "common/interfaces/result.interface";
import { UserDetails } from "modules/auth/interfaces/login-response.interface";
import { UpdateProfileDto } from "../dto/update-profile.dto";

export interface IProfile {
    getOwnProfile(id: string): PromiseResult<UserDetails>;
    updateOwnProfile(id: string, data: UpdateProfileDto): PromiseResult<UserDetails>;
}