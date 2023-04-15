import { FC, FormEvent, FormEventHandler, useRef, useState } from "react";
import { ModalProps, ModalType } from "../Types";
import { useClickAway } from "../utls";

const Modal: FC<ModalProps> = ({
  description,
  title,
  modalType,
  isModalOpen,
  setCloseModal,
}: ModalProps) => {
  const [emailAddress, setEmailAddress] = useState<string>("");
  const modal = useRef<HTMLDivElement>(null);

  useClickAway(modal, () => setCloseModal(!isModalOpen), isModalOpen);

  const subscribe = () => {
    if (emailAddress != "") {
      fetch(
        "https://infinity-travel-limo.zeejaydevbackend.com/api/travel-limo/emailSub",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailAddress,
          }),
        }
      );
    }
  };

  const handleClick = () => {
    if (emailAddress == "") {
      return;
    }
    subscribe();
    setCloseModal(false);
  };
  return (
    <div
      className="fixed bg-[rgb(0,0,0,0.5)] min-h-[100vh]
  min-w-[100vw] z-[900] top-0 flex justify-center items-center
  left-0"
    >
      {modalType == ModalType.emailCaptuer && (
        <div ref={modal} className="bg-white flex flex-col rounded-md">
          <h1 className="text-xl font-bold uppercase text-center py-5">
            {title}
          </h1>
          <p className="text-center px-5 capitalize font-medium">
            {description}
          </p>
          <form onSubmit={handleClick}>
            <div className="flex flex-col px-5 py-5">
              <label htmlFor="email"> Email</label>
              <input
                required
                onChange={(e) => setEmailAddress(e.currentTarget.value)}
                id="email"
                type="email"
                className="border-2
                border-input-border
                p-5
                focus:outline-char-black
                text-char-black
                placeholder-input-place-holder"
              />
            </div>
            <div className="py-5 px-5 flex justify-center">
              <button
                onClick={handleClick}
                className="py-3 p-5 bg-black text-white font-semibold uppercase"
              >
                subscribe
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Modal;
