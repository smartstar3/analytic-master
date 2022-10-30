import { Component, OnInit } from '@angular/core';
import { SlimOptions } from '../../../../../shared/components/slim/slim.component';
import { ImageService } from '../../../../image-stuff/image.service';
import { MessengerService } from '../../../../../messenger/messenger.service';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../../auth/auth.service';

const MAX_CONTAINER_WIDTH = 600;
const MAX_CONTAINER_HEIGHT = 400;
const INITIAL_CONTAINER_HEIGHT = 120;

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {
  containerWidth = MAX_CONTAINER_WIDTH;
  containerHeight = INITIAL_CONTAINER_HEIGHT;

  imageManagerOptions: SlimOptions = {
    service: environment.api_base + 'images/upload',
    defaultInputName: 'uploadOptions',
    meta: { name: '' },
  };

  constructor(private imageService: ImageService, private msgr: MessengerService, private auth: AuthService) {}

  ngOnInit(): void {
    const jwtToken = this.auth.getAccessTokenInfoSync().token;
    this.imageManagerOptions.willRequest = (xhr: XMLHttpRequest, data) => {
      xhr.abort();
      xhr.setRequestHeader('Authorization', `Bearer ${jwtToken}`);
    };
    
    this.imageManagerOptions.didLoad = (file, image, meta) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.fixContainerSize(image.width, image.height);
      return true;
    };
    this.imageManagerOptions.didConfirm = (data) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.fixContainerSize(data.output.width, data.output.height);
    };
    
    this.imageManagerOptions.didReceiveServerError = (err, defaultError) => {
      return err;
    };
  }

  fixContainerSize(width: number, height: number): void {
    const maxRatio = MAX_CONTAINER_WIDTH / MAX_CONTAINER_HEIGHT;
    const ratio = width / height;

    if (ratio < maxRatio) {
      this.containerHeight = MAX_CONTAINER_HEIGHT;
      this.containerWidth = MAX_CONTAINER_HEIGHT * ratio;
    } else {
      this.containerWidth = MAX_CONTAINER_WIDTH;
      this.containerHeight = MAX_CONTAINER_WIDTH / ratio;
    }
  }
}
