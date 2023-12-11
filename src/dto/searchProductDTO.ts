interface ProductType {
	title: string;
}

class SearchProductDto {
	title: string;
	constructor(product: ProductType) {
		this.title = product.title;
	}
}

export default SearchProductDto;
