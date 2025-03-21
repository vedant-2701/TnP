package com.tnp.tnpbackend.helper;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import com.tnp.tnpbackend.dto.StudentExcelDTO;
import com.tnp.tnpbackend.model.Student;

@Component
public class AdminHelper {

    public boolean checkExcelFormat(MultipartFile file) {
        String excelType = file.getContentType();
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(excelType);
    }

    public List<Student> convertExcelToListOfFacultyt(InputStream is) {
        List<Student> list = new ArrayList<>();
        try {
            Workbook workbook = new XSSFWorkbook(is);
            System.out.println(workbook);
            Sheet sheet = workbook.getSheet("data");
            if (sheet == null) {
                System.out.println("Sheet 'data' not found in the Excel file.");
                return list;
            }
            int rowNum = 0;
            Iterator<Row> iterate = sheet.iterator();
            while (iterate.hasNext()) {
                Row row = iterate.next();
                if (rowNum == 0) { // Skip header row
                    rowNum += 1;
                    continue;
                }
                Iterator<Cell> cells = row.iterator();
                int cellId = 0;
                StudentExcelDTO student = new StudentExcelDTO();
                Student std = new Student();
                while (cells.hasNext()) {
                    Cell cell = cells.next();
                    // Handle different cell types
                    String cellValue = getCellValueAsString(cell);
                    switch (cellId) {
                        case 0:
                            student.setUsername(cellValue);
                            break;
                        case 1:
                            student.setPassword(cellValue);
                            break;
                        default:
                            break;
                    }
                    cellId += 1;
                }

                std.setUsername(student.getUsername());
                std.setPassword(student.getPassword());
                std.setRole("ROLE_STUDENT");

                boolean done = list.add(std);
                if (done) {
                    System.out.println("done");
                }
            }
            workbook.close(); 
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
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