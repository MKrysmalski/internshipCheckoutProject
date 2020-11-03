import { ApiProperty } from "@nestjs/swagger";

export class DeleteItemDto {
    @ApiProperty()
    ids: string[];
}
