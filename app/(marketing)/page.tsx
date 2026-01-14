import { getAllCategories } from "@/lib/getAllCategories";
import CategoryClient from "@/app/(marketing)/components/CategoryClient";

export default async function CategoriesPage() {
    const categories = await getAllCategories();

    return <CategoryClient categories={categories} />;
}
