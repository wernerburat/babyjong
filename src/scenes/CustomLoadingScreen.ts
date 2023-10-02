import { ILoadingScreen } from "@babylonjs/core";

export class CustomLoadingScreen implements ILoadingScreen {
  loadingUIBackgroundColor: string;
  loadingUIText: string;

  constructor(
    private loadingBar: HTMLElement,
    private percentLoaded: HTMLElement,
    private loader: HTMLElement
  ) {
    this.loadingUIBackgroundColor = "black";
    this.loadingUIText = "Loading...";
  }

  displayLoadingUI = () => {
    this.loadingBar.style.width = "0%";
    this.percentLoaded.innerText = "0%";
  };
  hideLoadingUI = () => {
    this.loader.id = "loaded";

    setTimeout(() => {
      this.loader.style.display = "none";
    }, 1000);
  };

  updateLoadingUI = (status: string) => {
    this.loadingBar.style.width = `${status}%`;
    this.percentLoaded.innerText = `${status}%`;
  };
}
