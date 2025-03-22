package com.tnp.tnpbackend.helper;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

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

    public boolean checkExcelFormat(MultipartFile file) {
        String excelType = file.getContentType();
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(excelType);
    }

    public List<Student> convertExcelToListOfStudents(InputStream is) {
        List<Student> list = new ArrayList<>();

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

                if (rowNum == 0) {
                    rowNum++;
                    continue;
                }

                Iterator<Cell> cells = row.iterator();
                int cellId = 0;
                Student student = new Student();
                String username = null;

                while (cells.hasNext()) {
                    Cell cell = cells.next();
                    String cellValue = getCellValueAsString(cell);

                    switch (cellId) {
                        case 0:
                            username = cellValue.trim();
                            student.setUsername(username);
                            break;
                        case 1:
                            student.setPassword(cellValue);
                            break;
                        default:
                            break;
                    }
                    cellId++;
                }

                student.setCreatedAt(LocalDate.now());
                student.setRole("ROLE_STUDENT");

                if (username != null && !username.isBlank() &&
                        !studentRepository.existsByUsername(username)) {
                    list.add(student);
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