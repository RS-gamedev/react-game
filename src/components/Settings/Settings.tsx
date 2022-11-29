import React from "react";
import { Shape } from "../../models/Shape";
import Button from "../Button/Button";
import styles from "./Settings.module.css";

type Props = {
  shapes: Shape[];
  onClick: (shapeId: string) => void;
  width:string
};

const Settings = React.memo(({ shapes, onClick, width }: Props) => {
  return (
    <div className={styles.settingsBox} style={{width:width}}>
      <h3 className={styles.title} style={{ margin: 0 }}>
        Buildings
      </h3>
      <div className={styles.shapePicker}>
        {shapes.map((option) => {
          return (
            <Button
              imageHeight={"25px"}
              key={option.id}
              price={option.price}
              active={option.selected ? option.selected : false}
              disabled={false}
              text={option.name}
              onClick={() => onClick(option.id)}
              width="100px"
              height="100px"
              icon={option.icon}
              iconColor={option.iconColor}
            ></Button>
          );
        })}
      </div>
    </div>
  );
});
export default Settings;
