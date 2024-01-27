interface ProductType {
	title: string;
	_id: object;
}

class SearchProductDto {
	title: string;
	id: object;
	constructor(product: ProductType) {
		this.title = product.title;
		this.id = product._id;
	}
}

export default SearchProductDto;
