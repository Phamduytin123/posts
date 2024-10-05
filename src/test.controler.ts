import { Controller, Get } from "@nestjs/common";
import { TestService } from "./test.service";

@Controller()
export class testController {
    constructor(private service: TestService) { }
    @Get('calc')
    render() {
        return this.service.calc();
    }
}