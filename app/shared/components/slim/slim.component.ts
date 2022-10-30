import { Component, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';
import SlimLib from './lib/slim.commonjs';

export interface SlimOptions {
  // label HTML to show inside drop area
  label?: string; // default: '<p>Drop your image here</p>',
  labelLoading?: string; // default: '<p>Loading image...</p>',
  // error messages
  statusFileType?: string; // default: '<p>Invalid file type, expects: $0.</p>'
  statusFileSize?: string; // default: '<p>File is too big, maximum file size: $0 MB.</p>'
  statusNoSupport?: string; // default:'<p>Your browser does not support image cropping.</p>'
  statusImageTooSmall?: string; // default: '<p>Image is too small, minimum size is: $0 pixels.</p>'
  statusContentLength?: string; // default: '<span class="slim-upload-status-icon"></span> The file is probably too big'
  statusUnknownResponse?: string; // default: '<span class="slim-upload-status-icon"></span> An unknown error occurred'
  statusUploadSuccess?: string; // default: '<span class="slim-upload-status-icon"></span> Saved'
  statusLocalUrlProblem?: string;

  // initial image
  initialImage?: string;
  // edit button is enabled by default
  edit?: boolean;
  // immidiately summons editor on load
  instantEdit?: boolean; // default is false
  // set to true to upload data as base64 string
  uploadBase64?: boolean;
  // metadata values
  meta?: any;
  // ratio of crop by default is the same as input image ratio
  ratio?: string; // default is 'free', ex: '3:2'
  // use fix value for device pixel ratio
  devicePixelRatio?: number; // default is 1 -> set to 'auto' to use device ratio
  // dimensions to resize the resulting image to
  size?: { width: number; height: number } | string; // ex: '600,400' or { width: 600, height: 400 }
  // set initial rotation
  rotation?: number; // rotation % 90 == 0
  // initial crop settings for example: {x:0, y:0, width:100, height:100}
  crop?: { x: number; y: number; width: number; height: number };
  // post these values
  post?: string[]; // default is ['output', 'actions'],
  // call this service to submit cropped data
  service?: string;
  serviceFormat?: string;
  // sharpen filter value, really low values might improve image output
  filterSharpen?: number; // default is 0;
  // when service is set, and this is set to true, Soon will auto upload all crops (also auto crops)
  push?: boolean; // default is false,
  // default fallback name for field
  defaultInputName?: string; // default is'slim[]',
  // minimum size of cropped area object with width and height property
  minSize?: { width: number; height?: number };
  // maximum file size in MB to upload
  maxFileSize?: number;
  // compression of JPEG (between 0 and 100)
  jpegCompression?: number;
  // upload method of request
  uploadMethod?: string; // default is 'POST'
  // render download link
  download?: boolean; // default is false
  // save initially loaded image
  saveInitialImage?: boolean; // default is false
  // the type to force (jpe|jpg|jpeg or png)
  forceType?: boolean; // default is false
  // the forced output size of the image
  forceSize?: { width: number; height: number } | string;
  forceMinSize?: boolean; // default is true
  // disable drop to replace
  dropReplace?: boolean; // default is true,
  // remote URL service
  fetcher?: string;
  // set the internal canvas size
  internalCanvasSize?: { width: number; height: number };
  // use these settings on low memory enviroment
  internalCanvasSizeLowMemory?: { width: number; height: number };
  // copies the input image meta data to the output image
  copyImageHead?: boolean; // default is false
  // enable or disable rotation
  rotateButton?: boolean; // default is true,
  // popover classname
  popoverClassName?: string;
  //callback methods
  didInit?: (data) => void;
  didLoad?: (file, image, meta) => boolean;
  didSave?: (data) => void;
  didUpload?: (err, data, res) => void;
  didReceiveServerError?: (err, defaultError) => string;
  didRemove?: (data) => void;
  didTransform?: (data) => void;
  didConfirm?: (data) => void;
  didCancel?: (data) => void;
  didThrowError?: () => void;
  willLoadCanvas?: (image, cb) => void;
  willCropInitial?: (file, cb) => void;
  willTransform?: (data, cb) => void;
  willSave?: (data, cb) => void;
  willRemove?: (data, cb) => void;
  willRequest?: (xhr, data) => void;
  willFetch?: (xhr) => void;
  willLoad?: (xhr) => void;

  buttonConfirmLabel?: string;
  buttonConfirmTitle?: string;
  buttonConfirmClassName?: string;
  buttonCancelTitle?: string;
  buttonCancelLabel?: string;
  buttonCancelClassName?: string;
  buttonEditLabel?: string;
  buttonEditTitle?: string;
  buttonRemoveLabel?: string;
  buttonRotateLabel?: string;
  buttonRotateTitle?: string;
}

@Component({
  selector: 'app-slim',
  templateUrl: './slim.component.html',
  styleUrls: ['./slim.component.scss'],
})
export class SlimComponent implements AfterViewInit {
  @ViewChild('slim') element: ElementRef;

  @Input() options: SlimOptions = {};

  ngAfterViewInit(): void {
    if (this.options?.initialImage) {
      const img = document.createElement('img');
      img.setAttribute('alt', '');
      img.src = this.options.initialImage;
      this.element.nativeElement.appendChild(img);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    SlimLib.create(this.element.nativeElement, this.options);
  }
}
