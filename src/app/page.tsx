"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductPage from "./_components/product-page";
import TransactionPage from "./_components/transaction-page";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <main className="min-h-screen w-full font-[family-name:var(--font-geist-sans)]">
      <div className="mx-auto max-w-screen-2xl w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductPage activeTab={activeTab} />
          </TabsContent>
          <TabsContent value="transactions">
            <TransactionPage activeTab={activeTab} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
