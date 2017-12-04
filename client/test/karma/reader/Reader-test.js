import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import sinon from 'sinon';
// import XhrStub from '../../helpers/XhrStub';

import Reader from '../../../app/reader/index.jsx';
import readerAppeal from '../../data/reader,appeal.json';
describe.only('Reader', () => {
  // describe('getSquaredDistanceToCenter', () => {
  //   it()
  // });

  // const getDocument = async () => {
  //   const data = atob(
  //     'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
  //     'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
  //     'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
  //     'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
  //     'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
  //     'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
  //     'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
  //     'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
  //     'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
  //     'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
  //     'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
  //     'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
  //     'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');

  //   return await PDFJS.getDocument({ data });
  // }

  // const FILE_NAME = 'test';
  // const PAGE_INDEX = 0;

  let wrapper;
  let server;

  before(() => {
    const props = {
      userDisplayName: "Test User",
      dropdownUrls: [
        {
          title: "Help",
          link: "https://help.com"
        },
        {
          title: "Send Feedback",
          link: "https://test.com",
          target: "_blank"
        }
      ],
      page: "DecisionReviewer",
      feedbackUrl: "https://test.com",
      pdfWorker: "pdf_worker",
      buildDate: "1/2/2017",
      featureToggles: null,
      router: MemoryRouter
    };

    server = sinon.fakeServer.create();
    server.respondWith('GET', '/reader/appeal?json', [200, { 'Content-Type': 'application/json' }, JSON.stringify(readerAppeal)]);
    server.respondImmediately = true;

    wrapper = mount(<Reader {...props} />, { attachTo: document.body });
  });

  after(() => {
    wrapper.detach();
    server.restore();
  });

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  describe('When page is visible', async () => {
    it('setUpPdfPage is called', async () => {
      // console.log(wrapper.debug());
      // debugger;
      // server.respond();
      await sleep(1000);
      debugger;
      expect(true).to.equal(true);
    });
  });
});
