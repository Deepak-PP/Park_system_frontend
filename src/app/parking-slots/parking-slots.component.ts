  import { Component, OnInit } from '@angular/core';
  import { ParklotService } from '../parklot.service';
import { DatePipe } from '@angular/common';
  import Swal from 'sweetalert2';

  import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
  } from '@angular/forms';

  @Component({
    selector: 'app-parking-slots',
    templateUrl: './parking-slots.component.html',
    styleUrls: ['./parking-slots.component.css'],
  })
  export class ParkingSlotsComponent implements OnInit {
    parkForm!: FormGroup;
    parkingSlot: any;
    showDatePicker: Boolean = false;
    selectedStartDate: any;
    selectedEndDate: any;
    selectedCard: any;
    selectedCardTemp: any;
    tempPersonName: any;
    
    tempPersonExist:Boolean = false
    formData: any;
    leaveStartDate: any;
    leaveEndDate: any;

    constructor(
      private fb: FormBuilder,
      private parkService: ParklotService,
      private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
      this.defaultMembersData();
      this.parkSlotData();
    }

    defaultMembersData() {
      return this.parkService.getdefaultMembers().subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    }

    parkSlotData() {
      return this.parkService.getParkSlots().subscribe(
        (response) => {
          this.parkingSlot = response;
          console.log(this.parkingSlot, 'this is the parkingslot');
           const tempPersonData = this.parkingSlot.find(
             (slot: any) => slot.tempPerson
           )
          console.log(tempPersonData, 'this is the tempPersonData');
          if (tempPersonData) { 
            
          }
          console.log(this.tempPersonExist, 'this is the tempPersonExist');
            const slotWithLeave = this.parkingSlot.find(
              (slot: any) => slot.leaveStartDate && slot.leaveEndDate
            );

          if (slotWithLeave) {
            this.leaveStartDate = slotWithLeave.leaveStartDate;
            this.leaveEndDate = slotWithLeave.leaveEndDate;
          }
          console.log(this.leaveStartDate, this.leaveEndDate, 'leaveStartDate');
        },
        (error) => {
          console.log(error);
        }
      );
    }

    formatDate(dateString: string) {
      const date = new Date(dateString);
      return this.datePipe.transform(date, 'dd-MM-yyyy');
    }

    onAddLeaveButtonClick(parkData: any) {
      this.parkForm = this.fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
      });
      this.selectedCard = parkData;
    }

    onDateSelected() {
      if (this.parkForm.valid && this.selectedCard) {
        this.formData = {
          ...this.parkForm.value,
          slotName: this.selectedCard.slotName,
        };
        console.log(this.formData, 'this is the form data');

        this.parkService.temporaryLeaveAdd(this.formData).subscribe(
          (response) => {
            console.log(response);
            if (response) { 
              const updatedParkingLeave = this.parkingSlot.map((slot: any) => {
                if (slot.slotName === this.selectedCard.slotName) {
                  slot.leaveStartDate = this.formData.startDate;
                  slot.leaveEndDate = this.formData.endDate;
                }
                return slot;
              });

              // Update the component's data and trigger change detection
              this.parkingSlot = updatedParkingLeave;
             this.parkService.notifySwal("Your leave dates have been recorded","success")

            }
            this.parkForm.reset();
            this.selectedCard = null;
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }

    // Add this method to your component
    onAddTemporaryPersonButtonClick(parkData: any) {
      this.parkForm = this.fb.group({
        tempPersonName: ['', Validators.required],
        startDateTemp: ['', [Validators.required]],
        endDateTemp: ['', [Validators.required]],
      });
      console.log(parkData, 'is it consoled temp');
      this.selectedCardTemp = parkData;
    }

    onTemporaryPersonAdd() {
      if (this.parkForm.valid && this.selectedCardTemp) {
        const { tempPersonName, startDateTemp, endDateTemp   } =
          this.parkForm.value;

        // Validate start date and end date within leave period
        if (this.isInvalidStartDate() || this.isInvalidEndDate()) {
          this.showInvalidDateAlert()
          return;
        }
        console.log("formdata going to submit");
        

        const formData = {
          tempPersonName,
          startDateTemp,
          endDateTemp,
          slotName: this.selectedCardTemp.slotName,
        };

        this.parkService.temporaryPersonAdd(formData).subscribe(
          (response) => {
            console.log(response);
            if (response) {
              const updatedParkingSlot = this.parkingSlot.map((slot: any) => {
                if (slot.slotName === this.selectedCardTemp.slotName) {
                  slot.tempPerson = {
                    name: tempPersonName,
                    start_date: startDateTemp,
                    end_date: endDateTemp,
                  };
                }
                return slot;
              });

              // Update the component's data and trigger change detection
              this.parkingSlot = updatedParkingSlot;



              this.parkService.notifySwal(
                'Great! You have booked the slot',
                'success'
              );
              
              
            }
            // Reset form and selectedCardTemp after successful submission
            this.parkForm.reset();
            this.selectedCardTemp = null;
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }

    isInvalidStartDate(): boolean {
      const startDate = this.parkForm.get('startDateTemp')?.value;
      console.log(startDate,"date got start");
      
      return (
        startDate && this.leaveStartDate && startDate < this.leaveStartDate
      );
    }

    isInvalidEndDate(): boolean {
      const endDate = this.parkForm.get('endDateTemp')?.value;
      console.log(endDate, 'date got end');
      return endDate && this.leaveEndDate && endDate > this.leaveEndDate;
    }

    showInvalidDateAlert() {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date Range',
        text: 'Please select a date within the leave period.',
      });
    }
  }
