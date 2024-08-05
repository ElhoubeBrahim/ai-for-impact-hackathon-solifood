import { Component, inject, OnInit } from '@angular/core';
import { InputComponent } from '../../components/input/input.component';
import { ButtonComponent } from '../../components/button/button.component';
import { Subscription } from 'rxjs';
import { User } from '../../core/models/user';
import { StorageService } from '../../core/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [InputComponent, ButtonComponent, FormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private storage = inject(StorageService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private authentication = inject(AuthenticationService);

  loading = false;
  picture: File | null = null;
  data = {
    firstName: '',
    lastName: '',
  };

  userSubscription: Subscription | undefined;
  currentUser: User | undefined;

  async ngOnInit() {
    this.userSubscription = this.storage.user$.subscribe(async (user) => {
      this.currentUser = user;

      this.data = {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
      };
    });
  }

  previewImage(event: Event) {
    // If there is no file selected, exit
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    // Store the selected file
    this.picture = input.files[0];

    // Create the file preview
    let reader = new FileReader();
    reader.onload = (e: any) => {
      const url = e.target.result;
      document.getElementById('preview-user-picture')!.setAttribute('src', url);
    };
    reader.readAsDataURL(input.files[0]);
  }

  async saveUser() {
    if (this.loading || this.currentUser == null) return;
    this.loading = true;
    if (!this.validateUser()) {
      this.loading = false;
      this.toastr.error('Please fill all the required fields');
      return;
    }

    try {
      // Upload images
      let image = this.currentUser.picture;
      if (this.picture) {
        image = await this.authentication.uploadProfilePicture(this.picture);
        if (!image) {
          this.loading = false;
          this.toastr.error('Please upload valid image file');
          return;
        }
      }

      // Create basket
      await this.authentication.updateUser({
        ...this.data,
        picture: image,
      });

      // Update user data
      this.storage.setUser({
        ...this.currentUser,
        ...this.data,
        picture: image,
      });

      // Redirect to explore
      this.toastr.success('Profile updated successfully');
      this.router.navigate(['/profil']);
      this.loading = false;
    } catch (error) {
      this.toastr.error('An error occurred while updating the profile');
      this.loading = false;
    }
  }

  validateUser() {
    return (
      this.data.firstName &&
      this.data.firstName.length > 0 &&
      this.data.lastName &&
      this.data.lastName.length > 0
    );
  }
}
