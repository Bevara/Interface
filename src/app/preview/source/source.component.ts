import { Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { AccessorsService } from 'src/app/services/accessors.service';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss'],
  standalone: true,
  imports: [MatIconModule, MatRadioModule, MatExpansionModule, MatButtonModule, MatChipsModule, MatRadioModule, MatInputModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule]
})

export class SourceComponent {
  validUrl = false;
  // Kept aligned with the demos published at https://bevara.github.io/Showcase/
  // The first entry is the source the editor loads on start-up.
  test_sequences = [
    ['Display JPEG XL images', 'https://bevara.github.io/Showcase/test_sequences/zoltan-tasi-CLJeQCr2F_A-unsplash.jxl'],
    ['Play AIFF audio', 'https://bevara.github.io/Showcase/aiff/M1F1-int16-AFsp.aif'],
    ['Play Apple Lossless audio', 'https://bevara.github.io/Showcase/alac/testcard.m4a'],
    ['Play AMR speech', 'https://bevara.github.io/Showcase/amr/ff-16b-1c-8000hz.amr'],
    ['Play Monkey\'s Audio', 'https://bevara.github.io/Showcase/ape/ff-16b-2c-44100hz.ape'],
    ['Decode AV1 video (WebM)', 'https://bevara.github.io/Showcase/av1/CityHall_640x360.webm'],
    ['Decode AV1 video (Canvas)', 'https://bevara.github.io/Showcase/test_sequences/CityHall_640x360.webm'],
    ['Display AVIF images', 'https://bevara.github.io/Showcase/avif/example.avif'],
    ['Decode AVS2 video', 'https://bevara.github.io/Showcase/avs2/testcard.avs2'],
    ['Decode AVS3 video', 'https://bevara.github.io/Showcase/avs3/SFTI_640x360.avs3'],
    ['Display PCX, TGA, SGI, PNM and XBM images', 'https://bevara.github.io/Showcase/bitmaps/testcard.pcx'],
    ['Display BPG images', 'https://bevara.github.io/Showcase/bpg/photo.bpg'],
    ['Play Codec 2 speech', 'https://bevara.github.io/Showcase/codec2/testcard.c2'],
    ['Display DDS textures', 'https://bevara.github.io/Showcase/dds/kodim23_bc1.dds'],
    ['Decode Dirac video', 'https://bevara.github.io/Showcase/dirac/testcard.drc'],
    ['Play DTS audio', 'https://bevara.github.io/Showcase/dts/ff-16b-2c-48000hz.dts'],
    ['Decode MPEG-5 EVC video', 'https://bevara.github.io/Showcase/evc/testcard.evc'],
    ['Play FLAC audio', 'https://bevara.github.io/Showcase/flac/recit16bit.flac'],
    ['Display FLIF images', 'https://bevara.github.io/Showcase/flif/testcard.flif'],
    ['Play G.711 and G.72x audio', 'https://bevara.github.io/Showcase/g72x/testcard_g721.au'],
    ['Display GIF images', 'https://bevara.github.io/Showcase/gif/testcard_256colors.gif'],
    ['Play GSM 06.10 audio', 'https://bevara.github.io/Showcase/gsm/testcard.gsm'],
    ['Decode H.261 video', 'https://bevara.github.io/Showcase/h261/testcard.avi'],
    ['Decode H.262 video', 'https://bevara.github.io/Showcase/h262/testcard.m2v'],
    ['Decode H.263 video', 'https://bevara.github.io/Showcase/h263/testcard.avi'],
    ['Decode H.264 video', 'https://bevara.github.io/Showcase/h264/testcard.mp4'],
    ['Display HEIF images', 'https://bevara.github.io/Showcase/heif/example_flower_hevc.heif'],
    ['Decode HEVC video (MP4)', 'https://bevara.github.io/Showcase/test_sequences/hevcds_720p30_2M.mp4'],
    ['Display ICNS icons', 'https://bevara.github.io/Showcase/icns/test1.icns'],
    ['Play iLBC speech', 'https://bevara.github.io/Showcase/ilbc/testcard.lbc'],
    ['Display JBIG images', 'https://bevara.github.io/Showcase/jbig/testcard.jbg'],
    ['Display JBIG2 images', 'https://bevara.github.io/Showcase/jbig2/annex-h.jbig2'],
    ['Display JPEG images', 'https://bevara.github.io/Showcase/jpeg/Freedom.jpg'],
    ['Display JPEG 2000 images', 'https://bevara.github.io/Showcase/jpeg2000/Cevennes2.jp2'],
    ['Display JPEG-LS images', 'https://bevara.github.io/Showcase/jpegls/banny_hp0.jls'],
    ['Display JPEG XR images', 'https://bevara.github.io/Showcase/jxr/testcard.jxr'],
    ['Play LC3 audio', 'https://bevara.github.io/Showcase/lc3/testcard.lc3'],
    ['Play Dolby AC-3 audio', 'https://bevara.github.io/Showcase/test_sequences/Canyon-5.1-48khz-448kbit.ac3'],
    ['Play MIDI files', 'https://bevara.github.io/Showcase/midi/test.mid'],
    ['Decode Motion JPEG video', 'https://bevara.github.io/Showcase/mjpeg/testcard.avi'],
    ['Decode Motion JPEG video (Canvas)', 'https://bevara.github.io/Showcase/mjpeg-canvas/testcard.mov'],
    ['Decode Motion JPEG 2000 video (Canvas)', 'https://bevara.github.io/Showcase/mjpeg2000-canvas/testcard_j2k.mov'],
    ['Render MKV video', 'https://bevara.github.io/Showcase/test_sequences/Sintel_Trailer.480p.DivX_Plus_HD.mkv'],
    ['Display MNG and JNG', 'https://bevara.github.io/Showcase/mng/testcard_vlc.mng'],
    ['Play MP3 audio', 'https://bevara.github.io/Showcase/mp3/ff-16b-1c-44100hz.mp3'],
    ['Decode MPEG-2 video', 'https://bevara.github.io/Showcase/mpeg2-canvas/centaur_1.mpg'],
    ['Play Musepack audio', 'https://bevara.github.io/Showcase/musepack/ff-16b-2c-44100hz.mpc'],
    ['Play Opus audio', 'https://bevara.github.io/Showcase/opus/ff-16b-1c-44100hz.opus'],
    ['Render PDF documents', 'https://bevara.github.io/Showcase/pdf/minimal-document.pdf'],
    ['Display PGF images', 'https://bevara.github.io/Showcase/pgf/testcard_lossless.pgf'],
    ['Display PNG images', 'https://bevara.github.io/Showcase/png/Freedom.png'],
    ['Display Photoshop documents', 'https://bevara.github.io/Showcase/psd/testcard_rle.psd'],
    ['Display QOI images', 'https://bevara.github.io/Showcase/qoi/kodim23.qoi'],
    ['Display Camera RAW images', 'https://bevara.github.io/Showcase/raw/RAW_LEICA_M8.DNG'],
    ['Display retro computer images', 'https://bevara.github.io/Showcase/retro/testcard_uncompressed.iff'],
    ['Play Bluetooth SBC audio', 'https://bevara.github.io/Showcase/sbc/testcard.sbc'],
    ['Play Speex audio', 'https://bevara.github.io/Showcase/speex/testcard_wb.spx'],
    ['Decode Ogg/Theora video', 'https://bevara.github.io/Showcase/test_sequences/trailer_1080p.ogg'],
    ['Display TIFF images', 'https://bevara.github.io/Showcase/tiff/G4.TIF'],
    ['Play True Audio (TTA)', 'https://bevara.github.io/Showcase/tta/testcard.tta'],
    ['Decode Ut Video', 'https://bevara.github.io/Showcase/utvideo/testcard.avi'],
    ['Play Ogg Vorbis audio', 'https://bevara.github.io/Showcase/vorbis/Median_test.ogg'],
    ['Decode VP9 video (Canvas)', 'https://bevara.github.io/Showcase/test_sequences/elephants-dream.webm'],
    ['Decode VVC video (MP4)', 'https://bevara.github.io/Showcase/test_sequences/NovosobornayaSquare_640x360.mp4'],
    ['Play WavPack audio', 'https://bevara.github.io/Showcase/wavpack/ff-16b-2c-44100hz.wv'],
    ['Display WebP images', 'https://bevara.github.io/Showcase/webp/testcard_lossy.webp'],
    ['Display GIMP documents', 'https://bevara.github.io/Showcase/xcf/testcard_rle.xcf'],
    ['Play XVID video (AVI)', 'https://bevara.github.io/Showcase/test_sequences/Sintel_Trailer.480p.DivX_Home_Theater.divx'],
  ];
  url = "";

  importForm: FormGroup = new FormGroup({
    import_file: new FormControl('', [])
  });

  constructor(
    private el: ElementRef,
    public accessorsService: AccessorsService
  ) {
    accessorsService.src = this.test_sequences[0][1];
  }

  import(event?: any): void {
    if (event && event.target.files[0]) {
      this.accessorsService.filename = event.target.files[0].name;
      this.accessorsService.src = URL.createObjectURL(event.target.files[0]);
      this.accessorsService.source_option = 'local';
    } else {
      this.el.nativeElement.querySelector('#import_file').click();
    }
  }

  onSubmitURL() {
    try {
      new URL(this.url);
      this.validUrl = true;
      this.accessorsService.source_option = 'url';
      this.accessorsService.src = this.url;
    } catch (_) {
      this.validUrl = false;
    }
  }

  onSequenceChange(){
    this.accessorsService.source_option = 'test_sequence';
  }
}
