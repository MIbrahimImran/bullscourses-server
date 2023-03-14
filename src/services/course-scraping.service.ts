import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Browser } from 'puppeteer';

import { Course } from 'src/interfaces/course.interface';

@Injectable()
export class CourseScrapingService {
  private url = 'https://usfweb.usf.edu/DSS/StaffScheduleSearch';

  async getScrapedCourseData(): Promise<Course[]> {
    const browser = await puppeteer.launch();
    const page = await this.getStaffScheduleCoursePage(browser, '202301');
    const tableData = await this.getTableData(page);
    const formattedTableData = this.formatTableData(tableData);
    await browser.close();
    return formattedTableData;
  }

  async getStaffScheduleCoursePage(
    browser: Browser,
    term: string,
  ): Promise<puppeteer.Page> {
    const page = await browser.newPage();
    await page.goto(this.url);

    await this.selectFilters(page, term);

    const submitButton = await page.$('button[type="submit"]');

    const newPagePromise = new Promise((resolve) =>
      browser.once('targetcreated', resolve),
    );

    await submitButton.click();

    const newPageTarget = (await newPagePromise) as puppeteer.Target;
    const newPage = await newPageTarget.page();

    await newPage.waitForSelector('#results');

    await newPage.waitForTimeout(5000);

    return newPage;
  }

  async selectFilters(page: puppeteer.Page, term: string): Promise<void> {
    await page.waitForSelector('#P_SEMESTER');
    await page.select('#P_SEMESTER', term);

    await page.waitForSelector('#P_SESSION');
    await page.select('#P_SESSION', '1');

    await page.waitForSelector('#P_CAMPUS');
    await page.select('#P_CAMPUS', 'T');

    await page.waitForSelector('#p_insm_x_innl');
    await page.click('#p_insm_x_innl');

    await page.waitForSelector('#p_insm_x_inot');
    await page.click('#p_insm_x_inot');
  }

  async getTableData(page: puppeteer.Page) {
    const tableData = await page.$$eval('#results tr', (rows) =>
      rows.map((row) => {
        const columns = row.querySelectorAll('td');
        return Array.from(columns, (column: any) => column.textContent);
      }),
    );

    return tableData;
  }

  private formatTableData(tableData: any): Course[] {
    const formattedTableData = tableData.map((row: any) => {
      const [
        SESSION,
        COL,
        DPT,
        CRN,
        SUBJ_CRS,
        SEC,
        TYPE,
        TITLE,
        CR,
        PMT,
        STATUS,
        STATUS2,
        SEATSREMAIN,
        WAITSEATSAVAIL,
        CAP,
        ENRL,
        DAYS,
        TIME,
        BLDG,
        ROOM,
        INSTRUCTOR,
        CAMPUS,
        DELIVERYMETHOD,
        FEES,
      ] = row;

      return {
        SESSION,
        COL,
        DPT,
        CRN,
        SUBJ_CRS,
        SEC,
        TYPE,
        TITLE,
        CR,
        PMT,
        STATUS,
        STATUS2,
        SEATSREMAIN,
        WAITSEATSAVAIL,
        CAP,
        ENRL,
        DAYS,
        TIME,
        BLDG,
        ROOM,
        INSTRUCTOR,
        CAMPUS,
        DELIVERYMETHOD,
        FEES,
      };
    });

    return formattedTableData;
  }
}
