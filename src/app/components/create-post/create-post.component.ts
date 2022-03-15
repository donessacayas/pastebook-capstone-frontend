import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { SessionService } from 'src/app/services/session.service';
import { Friends } from '../tag-friends/tag-friends.component';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  name: string;
  displayTagged: Friends[] = [];
  displayTaggedLength = 0;
  imagePreview = '';
  isLoading: boolean = false;

  postForm: FormGroup = this.fb.group({
    content: '',
    image: '',
  });

  @Output() refresh = new EventEmitter<boolean>();

  @ViewChild('imageInput') imageInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.name = this.sessionService.getName();
  }

  onSubmit() {
    this.displayTaggedLength = 0;
    if (this.postForm.valid) {
      this.isLoading = true;
      this.postService.createPost(this.postForm.value).subscribe({
        next: this.onSuccess.bind(this),
      });
    }
  }

  onSuccess(res: any) {
    this.refresh.emit(true);
    this.isLoading = false;
    this.removeImage();
    this.postForm.get('content').setValue('');
    this.postForm.reset();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.image.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  addImage() {
    this.imageInput.nativeElement.click();
  }

  removeImage() {
    this.imagePreview = '';
  }

  get image() {
    return this.postForm.get('image');
  }

  // Tag Friends
  // ngDoCheck(): void {
  //   this.postForm.valueChanges.subscribe((data) => {
  //     this.displayTagged = data['tagged'];
  //     if (this.displayTagged) {
  //       this.displayTaggedLength = this.displayTagged.length;
  //     }
  //   });
  // }

  // getTaggedFriends(friends: Friends[]) {
  //   this.tagged.setValue(friends);
  // }
}
