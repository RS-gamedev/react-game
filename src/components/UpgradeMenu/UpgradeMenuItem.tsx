import { SyntheticEvent } from "react";
import Button from "../Button/Button";
import { BuyOption } from "../../models/BuyOption";
import React from "react";

type props = {
  buyOption: BuyOption;
  onClick: (e: SyntheticEvent) => void;
};
const UpgradeMenuItem = React.memo(({ buyOption, onClick }: props) => {
  return (
    <Button
      imageHeight={"35px"}
      imageName={buyOption.imageName!}
      key={buyOption.id}
      icon={buyOption.icon}
      active={false}
      disabled={false}
      price={buyOption.price}
      iconColor={"#ffffff"}
      height="100px"
      width="100px"
      onClick={onClick}
      text={buyOption.name}
    ></Button>
  );
});

export default UpgradeMenuItem;
