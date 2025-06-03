/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAtom, useAtomValue } from "jotai";
import SideBar from "./SideBar";
import { shapeAtom } from "../Atoms/ShapeState";
import RectIcon from "./RectIcon";
import EllipseIcon from "./EllipseIcon";
import { selectedIdsAtom } from "../Atoms/SelectedId";

type ShapeName = "Rectangle" | "Ellipse";

const shapeItemMap: Record<ShapeName, (color: string) => React.ReactElement> = {
  Rectangle: (color: string) => <RectIcon color={color} />,
  Ellipse: (color: string) => <EllipseIcon color={color} />,
};

export const LeftSideBar = () => {
  const shapes = useAtomValue(shapeAtom)
  const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);
  
  return (
    <SideBar className="leftSideBarLayout flex_col">
      <SideBar.Header content="제목1" type="big" className="paddingSideBar" />
      <SideBar.SpaceBar />
      <SideBar.Header
        content="Shapes"
        style={{ marginTop: "10px", marginBottom: "10px" }}
        className="paddingSideBar paddingSideBarMedium"
      />
      <SideBar.SpaceBar />
      <SideBar.Content className="overflow-y">
        {shapes.map(({ name, id } : any) => (
          <div
            key={`${name} ${id}`}
            onClick={() => setSelectedIds([...selectedIds, `${name} ${id}`])}
            className={`shape-item${
              selectedIds.includes(`${name} ${id}`) ? " primary" : ""
            }`}
          >
            {shapeItemMap[name as ShapeName]("black")}
            <span>
              {name} {id}
            </span>
          </div>
        ))}
      </SideBar.Content>
    </SideBar>
  );
};
