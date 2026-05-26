import * as bcrypt from 'bcrypt';
import {config} from 'dotenv';
config();

const salt = parseInt(process.env.BCRYPT_SALT ?? '10', 10);

export class BecryptService{

    hash(value : string) : string{
        return bcrypt.hashSync(value, salt);
    }

    verify(value : string, hash : string) : boolean{
        return bcrypt.compareSync(value, hash);
    }
}