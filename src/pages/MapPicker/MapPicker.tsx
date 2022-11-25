import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import { MapPickerObject } from "../../models/MapPickerObject";
import { generateMap } from "../../utils/MapUtils";
import styles from "./MapPicker.module.css";
type Props = {
  onStart: (objects: MapPickerObject[]) => void;
  mapSize: { height: number; width: number };
};

export default function MapPicker({ onStart, mapSize }: Props) {
  const [mapObjects, setMapObjects] = useState<MapPickerObject[]>();
  const settingsWidth = 240;

  useEffect(() => {
    setMapObjects(generateMap(mapSize.height - 60, 200, 50));
  }, []);

  const onClick = () => {
    console.log(mapObjects);
    if (mapObjects) onStart(mapObjects);
  };

  const generateNewMap = () => {
    setMapObjects(generateMap(mapSize.height - 60, 200, 50));
  };

  const mapItems: MapPickerObject[] = [
    {
      color: "green",
      name: "Tree",
      previewSize: { width: 200, height: 50 },
    },
    { color: "grey", name: "Rock", previewSize: { width: 200, height: 50 } },
  ];

  return (
    <div className={styles.background}>
      <div className={styles.settingsArea} style={{ width: settingsWidth }}>
        <div className={styles.settingsCard}>
          <div className={styles.legend}>
            {mapItems.map((x) => {
              return (
                <div className={styles.legendItem} style={{ width: x.previewSize.width, height: x.previewSize.height }}>
                  <div style={{ background: x.color }}></div>
                  <span>{x.name}</span>
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
