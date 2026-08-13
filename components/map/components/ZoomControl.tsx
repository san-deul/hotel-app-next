import styles from "../MainMap.module.css"
import { Plus, Minus } from 'lucide-react';

interface Props {
  map: any;
}

export default function ZoomControl({
  map
}: Props) {

  return (

    <div className={styles.zoom_control}>

      <button
        onClick={() => {

          map.current?.setZoom(
            (map.current?.getZoom() ?? 7) + 1,
            true
          );

        }}
      >

        <Plus />

      </button>

      <button
        onClick={() => {

          map.current?.setZoom(
            (map.current?.getZoom() ?? 7) - 1,
            true
          );

        }}
      >

        <Minus />

      </button>

    </div>

  )

}