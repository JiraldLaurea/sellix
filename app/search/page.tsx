import { getProducts } from "@/lib/getProducts";
import SearchResults from "./search-results";

export default async function SearchPage() {
    const products = await getProducts();

    return <SearchResults products={products} />;
}
