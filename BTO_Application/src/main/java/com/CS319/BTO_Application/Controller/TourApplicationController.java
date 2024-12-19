
package com.CS319.BTO_Application.Controller;

import com.CS319.BTO_Application.DTO.AddIndividualApplicationRequest;
import com.CS319.BTO_Application.DTO.AddSchoolApplicationRequest;
import com.CS319.BTO_Application.Entity.*;
import com.CS319.BTO_Application.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/tour-applications")
@Controller
public class TourApplicationController {

    private final SchoolTourApplicationService schoolTourApplicationService;
    private final IndividualTourApplicationService individualTourApplicationService;
    private final CounselorService counselorService;
    private final HighSchoolService highSchoolService;
    private final TourApplicationService tourApplicationService;
    private final TourService tourService;
    private final NotificationService notificationService;
    //there will be logic for individual tourapplciation also

    @Autowired
    public TourApplicationController(SchoolTourApplicationService schoolTourApplicationService, IndividualTourApplicationService individualTourApplicationService,
                                     CounselorService counselorService, HighSchoolService highSchoolService, TourApplicationService tourApplicationService,
                                     TourService tourService, NotificationService notificationService) {
        this.schoolTourApplicationService = schoolTourApplicationService;
        this.individualTourApplicationService = individualTourApplicationService;
        this.counselorService = counselorService;
        this.highSchoolService = highSchoolService;
        this.tourApplicationService = tourApplicationService;
        this.tourService = tourService;
        this.notificationService = notificationService;
    }



    @GetMapping("/getAll")
    public ResponseEntity<?> getAllTourApplications() {
        try {
            // Fetch all counselors from the service
            List<TourApplication> tourApplications = tourApplicationService.getAllTourApplications();
            return ResponseEntity.ok(tourApplications); // Return the list of counselors with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour applications.");
        }
    }
////////////////////////////
// SchoolTourApplication Methods START
    @GetMapping("/getAll/school-applications")
    public ResponseEntity<?> getAllSchoolTourApplications() {
        try {
            // Fetch all tour guides from the service
            List<SchoolTourApplication> tourApplications = schoolTourApplicationService.getAllSchoolTourApplications();
            return ResponseEntity.ok(tourApplications); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour applications.");
        }
    }

    @PostMapping("/add/school-application")
    public ResponseEntity<SchoolTourApplication> addSchoolApplication(@RequestBody AddSchoolApplicationRequest applicationRequest) {
        if(counselorService.getCounselorByUsername(applicationRequest.getCounselorUsername()) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by username

        if(schoolTourApplicationService.existsSchoolTourApplicationByHighSchoolAndDate(applicationRequest.getTourApplication(), applicationRequest.getCounselorUsername())){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(schoolTourApplicationService.addSchoolApplication(applicationRequest.getTourApplication(),applicationRequest.getCounselorUsername()), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/school-application")
    public ResponseEntity<SchoolTourApplication> deleteSchoolApplication(@RequestParam Long tourApplicationId) {
        schoolTourApplicationService.deleteSchoolTourApplicationById(tourApplicationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
////////////////////////////
// SchoolTourApplication Methods END

    ////////////////////////////
// IndividualTourApplication Methods START

    @GetMapping("/getAll/individual-applications")
    public ResponseEntity<?> getAllIndividualTourApplications() {
        try {
            // Fetch all tour guides from the service
            List<IndividualTourApplication> tourApplications = individualTourApplicationService.getAllIndividualTourApplications();
            return ResponseEntity.ok(tourApplications); // Return the list of tour guides with a 200 OK status
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving tour applications.");
        }
    }

    @PostMapping("/add/individual-application")
    public ResponseEntity<?> addIndividualApplication(@RequestBody AddIndividualApplicationRequest applicationRequest) {
        System.out.println("Received Application: " + applicationRequest);
        HighSchool highSchool = highSchoolService.getSchoolByName(applicationRequest.getSchoolName());
        if (highSchool == null) {
            return new ResponseEntity<>("High school not found", HttpStatus.NOT_FOUND);
        }

        IndividualTourApplication tourApplication = applicationRequest.getIndividualTourApplication();
        tourApplication.setApplyingHighschool(highSchool);
        tourApplication.setRequestedDates(applicationRequest.getRequestedDates()); // Set requestedDates here

        IndividualTourApplication savedApplication = individualTourApplicationService.addIndividualApplication(tourApplication);

        return new ResponseEntity<>(savedApplication, HttpStatus.CREATED);
    }

    @DeleteMapping("delete/individual-application")
    public ResponseEntity<?> deleteIndividualApplication(@RequestParam Long tourApplicationId) {
        individualTourApplicationService.deleteIndividualTourApplicationById(tourApplicationId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/counselor/cancel")
    public ResponseEntity<SchoolTourApplication> cancelSchoolTourApplication(@RequestParam String counselorEmail,@RequestParam Long tourApplicationId) {
        SchoolTourApplication schoolTourApplication = schoolTourApplicationService.getSchoolTourApplicationById(tourApplicationId);
        if(counselorService.getCounselorByUsername(counselorEmail) == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }// not found when searched by email
        Counselor counselor = counselorService.getCounselorByUsername(counselorEmail);
        if(schoolTourApplication.getApplyingCounselor().equals(counselor)){
            // Notification Logic
            Tour tour = tourService.getTourByApplicationId(tourApplicationId);
            if(tour != null){
                notifyForTourApplication(tour, tour.getAssignedGuideEmail(), "Guide Cancellation");
                tourService.cancelTourByCounselor(tourApplicationId);
            }
            return new ResponseEntity<>(schoolTourApplicationService.cancelSchoolTourApplication(counselorEmail, tourApplicationId), HttpStatus.ACCEPTED);
        }
        else{
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    private void notifyForTourApplication(Tour tour, String email, String situation) {
        String title = null;
        String text = null;
        if (situation.equals("Counselor Cancellation")) {
            title = "Onaylanan Üniversite Turunuzu İptal Ettiniz";
            text = "İptal Edilen Turun Bilgisi: <br>" +
                    "Tarih: " + tour.getChosenDate() +"<br>" +
                    "Saat: " + tour.getChosenTimeSlot().getDisplayName();
        }
        else if (situation.equals("Guide Cancellation")) {
            title = "Onaylanan Turunuz Lise Tarafından İptal Edildi";
            text = "Tur Bilgisi: <br>" +
                    "Tarih: " + tour.getChosenDate() +"<br>" +
                    "Saat: " + tour.getChosenTimeSlot().getDisplayName() +"<br>" +
                    "Lise: " + tour.getApplyingHighschool().getSchoolName() +"<br>" +
                    "Ziyaretçi Sayısı: " + tour.getVisitorCount();
        }

        if (title != null || text != null) {
            notificationService.createNotification(email, title, text);
        }
    }
    ////////////////////////////
// IndividualTourApplication Methods END


}

