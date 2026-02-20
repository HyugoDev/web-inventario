import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  // Para el precio, permitimos números con hasta 2 decimales y validamos que sea positivo
  price: z.coerce
    .number({ invalid_type_error: "El precio debe ser un número" })
    .positive("El precio debe ser un número positivo")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "El precio puede tener hasta 2 decimales",
    }),
  categoryId: z.string().min(1, "Debe seleccionar una categoría"),
  sku: z
    .string()
    .regex(
      /^[A-Z0-9-]+$/,
      "El SKU debe contener solo letras mayúsculas, números y guiones",
    )
    .min(3, "El SKU debe tener al menos 3 caracteres"),
  imageUrl: z.string().optional(),
});

export function ProductFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [openBox, setOpenBox] = useState(false);
  const [value, setValue] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 400);
  const { createProductMutation } = useProducts();
  const { categoriesSearchQuery } = useCategories(debouncedQuery);
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      sku: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    await createProductMutation.mutateAsync(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="font-mono uppercase">
            Nueva Categoría
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Electrónica" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Ej: 19.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Categoría</FormLabel>

                  <Popover
                    open={openBox}
                    onOpenChange={(open) => {
                      setOpenBox(open);
                      if (open) setSearchQuery("");
                    }}
                  >
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          aria-haspopup="listbox"
                          aria-expanded={openBox}
                          className="justify-between"
                        >
                          {field.value ? (
                            categoriesSearchQuery.data?.find(
                              (method) => method.id === field.value,
                            )?.name
                          ) : (
                            <span className="text-muted-foreground">
                              Select a category...
                            </span>
                          )}
                          <IconChevronDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                      <Command id="product-combobox-list">
                        <CommandInput
                          placeholder="Search category..."
                          value={searchQuery}
                          onValueChange={setSearchQuery}
                          role="combobox"
                          aria-controls="category-list"
                          aria-autocomplete="list"
                        />
                        <CommandList id="category-list" role="listbox">
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categoriesSearchQuery.data?.map((method: any) => (
                              <CommandItem
                                key={method.id}
                                value={method.id}
                                onSelect={() => {
                                  field.onChange(method.id);
                                  setOpenBox(false);
                                }}
                              >
                                {method.name}
                                <IconCheck
                                  className={cn(
                                    "ml-auto",
                                    value === method.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: PROD-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de Imagen</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full neon-glow"
              disabled={createProductMutation.isPending}
            >
              {createProductMutation.isPending
                ? "Guardando..."
                : "Crear Producto"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
