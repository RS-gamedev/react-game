import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import { MapPickerObject } from "../../models/MapPickerObject";
import { generateMap } from "../../utils/MapUtils";
import styles from "./MapPicker.module.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Icon from "../../components/Icon/Icon";

type CustomizeOption = {
  mapObject: MapPickerObject;
  value: number;
};

type Props = {
  onStart: (objects: MapPickerObject[]) => void;
  mapSize: { height: number; width: number };
};

export default function MapPicker({ onStart, mapSize }: Props) {
  const [mapObjects, setMapObjects] = useState<MapPickerObject[]>();
  const [customizeOptions, setCustomizeOptions] = useState<CustomizeOption[]>([
    {
      mapObject: {
        color: "green",
        name: "Tree",
        previewSize: { width: 200, height: 50 },
      },
      value: 300,
    },
    {
      mapObject: { color: "grey", name: "Rock", previewSize: { width: 200, height: 50 } },
      value: 150,
    },
  ]);
  const [triggerGenerate, setTriggerGenerate] = useState(false);

  const settingsWidth = 240;

  useEffect(() => {
    generateNewMap();
  }, [triggerGenerate]);

  const onClick = () => {
    if (mapObjects) onStart(mapObjects);
  };

  const generateNewMap = () => {
    let tree = customizeOptions.find((x) => x.mapObject.name === "Tree");
    let rock = customizeOptions.find((x) => x.mapObject.name === "Rock");
    if (!tree || !rock) return;
    setMapObjects((prev) => generateMap(mapSize.height - 60, tree!.value, rock!.value));
  };

  function changeValue(event: any, option: CustomizeOption) {
    setCustomizeOptions((prev) => {
      return prev.map((x) => {
        if (x.mapObject.name === option.mapObject.name) {
          return { ...x, value: event };
        }
        return { ...x };
      });
    });
  }

  function afterChange() {
    setTriggerGenerate((prev) => !prev);
  }

  return (
    <div className={styles.background}>
      <div className={styles.settingsArea} style={{ width: settingsWidth }}>
        <div className={styles.settingsCard}>
          <div className={styles.legend}>
            {customizeOptions.map((x) => {
              return (
                <div className={styles.sliderItem}>
                  <Icon fontSize="2em" height="35px" imageName={x.mapObject.name.toLowerCase()}></Icon>
                  <Slider
                    min={0}
                    max={500}
                    value={x.value}
                    onAfterChange={afterChange}
                    handleStyle={{
                      background: x.mapObject.color,
                      opacity: "1",
                      border: "none",
                      boxShadow: "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
                      height: "51px",
                    }}
                    trackStyle={{ backgroundColor: x.mapObject.color }}
                    onChange={(event) => changeValue(event, x)}
                  ></Slider>
                </div>
              );
            })}
          </div>
          <div className={styles.settingsFooter}>
            <Button
              onClick={generateNewMap}
              active={false}
              disabled={false}
              icon={["fas", "arrows-rotate"]}
              height="70px"
              width="100px"
              text="Generate new map"
              iconColor="#292d3e"
              imageHeight="50px"
            ></Button>
            <Button
              onClick={onClick}
              active={false}
              disabled={false}
              height="70px"
              width="100px"
              text="Let's go!"
              imageHeight="50px"
              icon={["fas", "play"]}
              iconColor="#292d3e"
            ></Button>
          </div>
        </div>
      </div>
      <div className={styles.map} style={{ height: mapSize.height - 50, width: mapSize.height - 50 }}>
        {mapObjects ? (
          mapObjects.map((x, index) => {
            return (
              <div
                key={index}
                className={styles.mapObject}
                style={{
                  width: x.previewSize.width,
                  height: x.previewSize.height,
                  left: x.position?.x,
                  top: x.position?.y,
                  background: x.color,
                  borderRadius: "3px",
                }}
              ></div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
