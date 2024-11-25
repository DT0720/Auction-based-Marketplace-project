export default function NoOngoingAuctions() {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center">
        <img src="/images/no-auctions.png" alt="No Auctions" className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto mb-8" />
        <h1 className="text-2xl font-bold mb-4">No Ongoing Auctions</h1>
        <p className="text-gray-600">There are no ongoing auctions at the moment. Please check back later.</p>
      </div>
    );
  }