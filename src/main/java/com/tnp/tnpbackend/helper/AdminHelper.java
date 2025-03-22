// package com.tnp.tnpbackend.helper;

// import java.io.InputStream;
// import java.util.ArrayList;
// import java.util.Iterator;
// import java.util.List;

// import org.apache.poi.ss.usermodel.Workbook;
// import org.apache.poi.xssf.usermodel.XSSFWorkbook;
// import org.springframework.stereotype.Component;
// import org.springframework.web.multipart.MultipartFile;
// import org.apache.poi.ss.usermodel.Cell;
// import org.apache.poi.ss.usermodel.Row;
// import org.apache.poi.ss.usermodel.Sheet;

// import com.tnp.tnpbackend.dto.StudentExcelDTO;
// import com.tnp.tnpbackend.model.Student;

// @Component
// public class AdminHelper {

//     public boolean checkExcelFormat(MultipartFile file) {
//         String excelType = file.getContentType();
//         return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(excelType);
//     }

//     public List<Student> convertExcelToListOfFacultyt(InputStream is) {
//         List<Student> list = new ArrayList<>();
//         try {
//             Workbook workbook = new XSSFWorkbook(is);
//             System.out.println(workbook);
//             Sheet sheet = workbook.getSheet("data");
//             if (sheet == null) {
//                 System.out.println("Sheet 'data' not found in the Excel file.");
//                 return list;
//             }
//             int rowNum = 0;
//             Iterator<Row> iterate = sheet.iterator();
//             while (iterate.hasNext()) {
//                 Row row = iterate.next();
//                 if (rowNum == 0) { // Skip header row
//                     rowNum += 1;
//                     continue;
//                 }
//                 Iterator<Cell> cells = row.iterator();
//                 int cellId = 0;
//                 StudentExcelDTO student = new StudentExcelDTO();
//                 Student std = new Student();
//                 while (cells.hasNext()) {
//                     Cell cell = cells.next();
//                     // Handle different cell types
//                     String cellValue = getCellValueAsString(cell);
//                     switch (cellId) {
//                         case 0:
//                             student.setUsername(cellValue);
//                             break;
//                         case 1:
//                             student.setPassword(cellValue);
//                             break;
//                         default:
//                             break;
//                     }
//                     cellId += 1;
//                 }

//                 std.setUsername(student.getUsername());
//                 std.setPassword(student.getPassword());
//                 std.setRole("ROLE_STUDENT");

//                 boolean done = list.add(std);
//                 if (done) {
//                     System.out.println("done");
//                 }
//             }
//             workbook.close(); 
//         } catch (Exception e) {
//             System.out.println("Error: " + e.getMessage());
//         }
//         return list;
//     }

//     private String getCellValueAsString(Cell cell) {
//         if (cell == null) {
//             return "";
//         }
//         switch (cell.getCellType()) {
//             case STRING:
//                 return cell.getStringCellValue();
//             case NUMERIC:
//                 if (cell.getNumericCellValue() % 1 == 0) {
//                     return String.valueOf((long) cell.getNumericCellValue());
//                 } else {
//                     return String.valueOf(cell.getNumericCellValue());
//                 }
//             case BOOLEAN:
//                 return String.valueOf(cell.getBooleanCellValue());
//             case BLANK:
//                 return "";
//             default:
//                 return "";
//         }
//     }
// }

package com.tnp.tnpbackend.helper;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.repository.StudentRepository;

@Component
public class AdminHelper {

    @Autowired
    private StudentRepository studentRepository;

    /**
     * Checks if the uploaded file is in Excel format.
     */
    public boolean checkExcelFormat(MultipartFile file) {
        String excelType = file.getContentType();
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(excelType);
    }

    /**
     * Converts Excel data to a list of Student objects, skipping duplicates in the
     * file and database.
     */
    public List<Student> convertExcelToListOfStudents(InputStream is) {
        List<Student> list = new ArrayList<>();
        Set<String> usernames = new HashSet<>(); // To track duplicates within the Excel file

        try {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet sheet = workbook.getSheet("data");

            if (sheet == null) {
                System.out.println("Sheet 'data' not found in the Excel file.");
                workbook.close();
                return list;
            }

            int rowNum = 0;
            Iterator<Row> iterate = sheet.iterator();

            while (iterate.hasNext()) {
                Row row = iterate.next();

                // Skip the header row
                if (rowNum == 0) {
                    rowNum++;
                    continue;
                }

                Iterator<Cell> cells = row.iterator();
                int cellId = 0;
                Student student = new Student();
                String username = null;

                // Parse each cell in the row
                while (cells.hasNext()) {
                    Cell cell = cells.next();
                    String cellValue = getCellValueAsString(cell);

                    switch (cellId) {
                        case 0: // Username column
                            username = cellValue.trim();
                            student.setUsername(username);
                            break;
                        case 1: // Password column
                            student.setPassword(cellValue);
                            break;
                        default:
                            break;
                    }
                    cellId++;
                }

                student.setRole("ROLE_STUDENT");

                // Check conditions to add the student:
                // 1. Username is not null or blank
                // 2. Username is not a duplicate in the Excel file
                // 3. Username does not already exist in the database
                if (username != null && !username.isBlank() &&
                        !usernames.contains(username) &&
                        !studentRepository.existsByUsername(username)) {

                    list.add(student);
                    usernames.add(username);
                    System.out.println("Added student with username: " + username);
                } else {
                    System.out.println("Skipped duplicate or existing username: " + username);
                }
            }

            workbook.close();
        } catch (Exception e) {
            System.out.println("Error processing Excel file: " + e.getMessage());
        }

        return list;
    }

    /**
     * Helper method to convert cell value to string.
     */
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (cell.getNumericCellValue() % 1 == 0) {
                    return String.valueOf((long) cell.getNumericCellValue());
                } else {
                    return String.valueOf(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case BLANK:
                return "";
            default:
                return "";
        }
    }
}