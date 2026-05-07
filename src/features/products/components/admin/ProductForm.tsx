"use client";

import { createProductAction, updateProductAction } from "@/_actions/products";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import TagsField from "@/components/ui/tagsField";
import { FieldInput } from "@/components/form/FieldInput";
import { useToast } from "@/components/ui/use-toast";
import { BadgeSelectField } from "@/features/cms";
import { ImageDialog } from "@/features/medias";
import { InsertProducts, SelectProducts } from "@/lib/supabase/schema";
import { productInsertSchema } from "@/features/products/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@urql/next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useTransition } from "react";
import { useForm } from "react-hook-form";
import { gql } from "urql";

type ProductsFormProps = {
  product?: SelectProducts;
};
export const ProductFormQuery = gql(/* GraphQL */ `
  query ProductFormQuery {
    collectionsCollection(orderBy: [{ label: AscNullsLast }]) {
      __typename
      edges {
        node {
          id
          label
        }
      }
    }
  }
`);

function ProductFrom({ product }: ProductsFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const [{ data }] = useQuery({
    query: ProductFormQuery,
  });

  const form = useForm<InsertProducts>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: { ...product },
  });

  const { control, handleSubmit } = form;

  const onSubmit = handleSubmit(async (data: InsertProducts) => {
    startTransition(async () => {
      try {
        const result = product
          ? await updateProductAction(product.id, data)
          : await createProductAction(data);

        if (!result) {
          throw new Error("Product save returned no result.");
        }

        router.push("/admin/products");
        router.refresh();

        toast({
          title: `Product is ${product ? "updated" : "created"}.`,
          description: `${data.name}`,
        });
      } catch (err) {
        toast({
          title: "Error",
          description:
            err instanceof Error ? err.message : "Unexpected Error occurred.",
          variant: "destructive",
        });
      }
    });
  });

  console.log("!!data", data);
  return (
    <Form {...form}>
      <form
        id="project-form"
        className="gap-x-5 flex gap-y-5 flex-col px-3"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-y-5 max-w-[500px]">
          <FieldInput
            control={control}
            name="name"
            label="Name*"
            inputProps={{ placeholder: "Type Product Name." }}
          />

          <FieldInput
            control={control}
            name="slug"
            label="Slug*"
            inputProps={{ placeholder: "Type Product slug." }}
          />

          <FieldInput
            control={control}
            name="description"
            label="Description*"
            inputProps={{
              placeholder: "Type a short description for the product..",
            }}
          />

          {/* <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <FormLabel>Featured*</FormLabel>
                  <Checkbox
                    defaultChecked={false}
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>

                <FormDescription>
                  You can manage your mobile notifications in the{" "}
                </FormDescription>
              </FormItem>
            )}
          /> */}
          <Suspense>
            {data && data.collectionsCollection && (
              <FormField
                control={control}
                name={"collectionId"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Collections"}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a collection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data.collectionsCollection.edges.map(
                          ({ node: collection }) => (
                            <SelectItem
                              value={collection.id}
                              key={collection.id}
                            >
                              {collection.label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {"Select a Collection for the products."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </Suspense>

          <BadgeSelectField name="badge" label={""} />

          <FieldInput
            control={control}
            name="rating"
            label="Rating*"
            inputProps={{ placeholder: "Rating (0-5)." }}
          />

          <FormItem>
            <FormLabel className="text-sm">Tags</FormLabel>
            <FormControl>
              <TagsField name={"tags"} defaultValue={product?.tags || []} />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FieldInput
            control={control}
            name="price"
            label="Price*"
            inputProps={{ placeholder: "Price" }}
          />

          <FormField
            control={form.control}
            name="featuredImageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image*</FormLabel>
                <Suspense>
                  <ImageDialog
                    defaultValue={product?.featuredImageId}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </Suspense>

                <FormDescription>
                  Drag n Drop the image to above section or click the button to
                  select from Image gallery.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="py-8 flex gap-x-5 items-center">
          <Button disabled={isPending} variant={"outline"} form="project-form">
            {product ? "Update" : "Create"}
            {isPending && (
              <Spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
          </Button>
          <Link href="/admin/products" className={buttonVariants()}>
            Cancel
          </Link>
        </div>
      </form>
    </Form>
  );
}

export default ProductFrom;
