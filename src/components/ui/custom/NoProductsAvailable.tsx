export default function NoProductsAvailable() {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center mx-auto">
        <img src="/assets/no-product-found.png" alt="No Products" className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto mb-8" />
      </div>
    );
  }