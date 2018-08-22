/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for AgriBlockchainAngularApp', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be AgriBlockchainAngularApp', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('AgriBlockchainAngularApp');
    })
  });

  it('network-name should be backend@0.0.6',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('backend@0.0.6.bna');
    });
  });

  it('navbar-brand should be AgriBlockchainAngularApp',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('AgriBlockchainAngularApp');
    });
  });

  
    it('Product component should be loadable',() => {
      page.navigateTo('/Product');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Product');
      });
    });

    it('Product table should have 14 columns',() => {
      page.navigateTo('/Product');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(14); // Addition of 1 for 'Action' column
      });
    });
  
    it('Plot component should be loadable',() => {
      page.navigateTo('/Plot');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Plot');
      });
    });

    it('Plot table should have 9 columns',() => {
      page.navigateTo('/Plot');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });
  
    it('Farm component should be loadable',() => {
      page.navigateTo('/Farm');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Farm');
      });
    });

    it('Farm table should have 8 columns',() => {
      page.navigateTo('/Farm');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(8); // Addition of 1 for 'Action' column
      });
    });
  
    it('Seed component should be loadable',() => {
      page.navigateTo('/Seed');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Seed');
      });
    });

    it('Seed table should have 11 columns',() => {
      page.navigateTo('/Seed');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  
    it('Fertilizer component should be loadable',() => {
      page.navigateTo('/Fertilizer');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Fertilizer');
      });
    });

    it('Fertilizer table should have 11 columns',() => {
      page.navigateTo('/Fertilizer');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  
    it('Pesticide component should be loadable',() => {
      page.navigateTo('/Pesticide');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Pesticide');
      });
    });

    it('Pesticide table should have 11 columns',() => {
      page.navigateTo('/Pesticide');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('Farmer component should be loadable',() => {
      page.navigateTo('/Farmer');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Farmer');
      });
    });

    it('Farmer table should have 11 columns',() => {
      page.navigateTo('/Farmer');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  
    it('Distribution component should be loadable',() => {
      page.navigateTo('/Distribution');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Distribution');
      });
    });

    it('Distribution table should have 13 columns',() => {
      page.navigateTo('/Distribution');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(13); // Addition of 1 for 'Action' column
      });
    });
  
    it('Packaging component should be loadable',() => {
      page.navigateTo('/Packaging');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Packaging');
      });
    });

    it('Packaging table should have 11 columns',() => {
      page.navigateTo('/Packaging');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  
    it('Warehouse component should be loadable',() => {
      page.navigateTo('/Warehouse');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Warehouse');
      });
    });

    it('Warehouse table should have 11 columns',() => {
      page.navigateTo('/Warehouse');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  
    it('Retail component should be loadable',() => {
      page.navigateTo('/Retail');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Retail');
      });
    });

    it('Retail table should have 12 columns',() => {
      page.navigateTo('/Retail');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(12); // Addition of 1 for 'Action' column
      });
    });
  
    it('SeedProvider component should be loadable',() => {
      page.navigateTo('/SeedProvider');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SeedProvider');
      });
    });

    it('SeedProvider table should have 11 columns',() => {
      page.navigateTo('/SeedProvider');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  
    it('FertilizerProvider component should be loadable',() => {
      page.navigateTo('/FertilizerProvider');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('FertilizerProvider');
      });
    });

    it('FertilizerProvider table should have 11 columns',() => {
      page.navigateTo('/FertilizerProvider');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  
    it('PesticideProvider component should be loadable',() => {
      page.navigateTo('/PesticideProvider');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('PesticideProvider');
      });
    });

    it('PesticideProvider table should have 11 columns',() => {
      page.navigateTo('/PesticideProvider');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  
    it('CertificationBody component should be loadable',() => {
      page.navigateTo('/CertificationBody');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('CertificationBody');
      });
    });

    it('CertificationBody table should have 11 columns',() => {
      page.navigateTo('/CertificationBody');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(11); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('TransferPackage component should be loadable',() => {
      page.navigateTo('/TransferPackage');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('TransferPackage');
      });
    });
  
    it('DivideAsset component should be loadable',() => {
      page.navigateTo('/DivideAsset');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('DivideAsset');
      });
    });
  
    it('MergeAsset component should be loadable',() => {
      page.navigateTo('/MergeAsset');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('MergeAsset');
      });
    });
  
    it('PHReading component should be loadable',() => {
      page.navigateTo('/PHReading');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('PHReading');
      });
    });
  
    it('Activity component should be loadable',() => {
      page.navigateTo('/Activity');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Activity');
      });
    });
  

});