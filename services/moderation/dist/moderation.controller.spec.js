"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const moderation_controller_1 = require("./moderation.controller");
const moderation_service_1 = require("./moderation.service");
describe('ModerationController', () => {
    let moderationController;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const app = yield testing_1.Test.createTestingModule({
            controllers: [moderation_controller_1.ModerationController],
            providers: [moderation_service_1.ModerationService],
        }).compile();
        moderationController = app.get(moderation_controller_1.ModerationController);
    }));
    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(moderationController.getHello()).toBe('Hello World!');
        });
    });
});
