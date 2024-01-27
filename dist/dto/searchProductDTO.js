"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SearchProductDto {
    constructor(product) {
        this.title = product.title;
        this.id = product._id;
    }
}
exports.default = SearchProductDto;
