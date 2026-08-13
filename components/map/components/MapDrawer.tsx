'use client';

import { Drawer } from 'vaul';
import styles from '../MainMap.module.css';
import { Hotel } from '../types/hotel';

interface Props {
  isPopupOpen: boolean;
  isMobile: boolean;

  selectedHotels: Hotel[];

  snap: number | string | null;

  setSnap: (
    value: number | string | null
  ) => void;

  isModalOpenRef:
  React.MutableRefObject<boolean>;

  onClose: () => void;

  onHotelClick: (
    hotel: Hotel
  ) => void;
}

export default function MapDrawer({

  isPopupOpen,
  isMobile,

  selectedHotels,

  snap,
  setSnap,

  isModalOpenRef,

  onClose,

  onHotelClick

}: Props) {

  return (

    <Drawer.Root

      open={
        isPopupOpen && isMobile
      }

      onOpenChange={(open) => {

        if (
          isModalOpenRef.current
        ) {
          return;
        }

        if (!open) {
          onClose();
        }

      }}

      modal={true}

      snapPoints={[
        0.32,
        0.9
      ]}

      activeSnapPoint={snap}

      setActiveSnapPoint={
        setSnap
      }

      fadeFromIndex={1}

      shouldScaleBackground={false}

      dismissible={false}

    >

      <Drawer.Portal>

        <Drawer.Content
          className={
            styles.vaul_drawer
          }
        >

          <Drawer.Handle
            className={
              styles.drawer_handle_wrapper
            }
          >

            <div
              className={
                styles.drawer_handle_bar
              }
            />

          </Drawer.Handle>

          <div
            className={
              styles.drawer_list
            }
          >

            {selectedHotels.map(
              (hotel) => (

                <div

                  key={hotel.title}

                  className={
                    styles.store_list_item
                  }

                  onClick={() => {

                    onHotelClick(
                      hotel
                    );

                  }}

                >

                  <p
                    className={
                      styles.store_title
                    }
                  >

                    {hotel.title}

                  </p>

                  <p
                    className={
                      styles.store_address
                    }
                  >

                    {hotel.address}

                  </p>

                </div>

              ))}

          </div>

        </Drawer.Content>

      </Drawer.Portal>

    </Drawer.Root>

  )

}