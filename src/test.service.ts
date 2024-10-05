import { Injectable } from "@nestjs/common";

@Injectable()
export class TestService {
    calc() {
        return 1 + 1;
    }
}