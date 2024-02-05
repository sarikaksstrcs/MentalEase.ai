import React from "react";
import Navbar from "../../components/Navbar/Navbar";
const data = [
  {
    id: 1,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpirPLU24E_McNlm_v12l37yGdrJOmOtt9yg&usqp=CAU",
    coins: 45,
    title: "iPhone",
  },
  {
    id: 2,
    image:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-card-40-s9-202309?wid=340&hei=264&fmt=p-jpg&qlt=95&.v=1693943487336",
    coins: 12,
    title: "Apple Watch",
  },
  {
    id: 3,
    image:
      "https://ik.imagekit.io/voltebyk/Hybrid-pro/Picsart_23-03-27_19-56-18-149__Large_.jpg?updatedAt=1679928186096",
    coins: 67,
    title: "Bicycle",
  },
  {
    id: 4,
    image:
      "https://www.theindusvalley.in/cdn/shop/products/gymwaterbottle_2b394a0b-dd6b-4d2e-9dec-4dc972dd495a.jpg?v=1668587829",
    coins: 90,
    title: "Bottle",
  },
];
const Awards = () => {
  return (
    <div className="flex flex-row">
      <Navbar />
      <div className="w-full">
        <div className="flex flex-row items-center justify-between p-6 bg-teal-100  h-fit shadow-lg">
          <h1 className="ml-4 text-3xl font-semibold text-teal-800">
            Rewards for you!
          </h1>
          <h1 className="text-xl font-semibold">Coins: 800</h1>
        </div>
        <div className="p-4 mt-8 flex flex-row gap-6 flex-wrap">
          {data.map((gift) => (
            <div className="bg-white shadow rounded flex flex-col">
              <img src={gift.image} className="w-[200px] h-[200px]" />
              <h1 className="mt-2 text-xl font-semibold">{gift.title}</h1>
              <h1 className="mt-2 text-lg">Price: {gift.coins}</h1>
              <button className="bg-teal-500 text-white rounded p-4 mb-2 align-center">
                Redeem
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Awards;
