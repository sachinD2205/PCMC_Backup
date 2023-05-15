import tpLabels from "./labels/modules/tpLabels";
import cfcLabels from "./labels/modules/cfcLabels";
import fbsLabels from "./labels/modules/fbsLabels";
import hmsLabels from "./labels/modules/hmsLabels";
import lcLabels from "./labels/modules/lcLabels";
import mrLabels from "./labels/modules/mrLabels";
import msLabels from "./labels/modules/msLabels";
import ptaxLabels from "./labels/modules/ptaxLabels";
import spLabels from "./labels/modules/spLabels";
import sslLabels from "./labels/modules/sslLabels";
import gmLabels from "./labels/modules/gmLabels";
import dashboardlabels from "./labels/common/dashboardLabels";
import loginLabels from "./labels/common/loginLabels";
import homeLabels from "./labels/common/homeLabels";
import ebpLabels from "./labels/modules/ebpLabels";
import bsupLabels from "./labels/modules/bsupLabels";
import vmsLabels from "./labels/modules/vmsLabels";
import lmLabels from "./labels/modules/lmLabels";
import slumLabels from "./labels/modules/slumLabels";
import smLabels from "./labels/modules/smLabels";
import schoolLabels from "./labels/modules/schoolLabels";
import nrmsLabels from "./labels/modules/nrmsLabels";
import profileLabels from "./labels/common/profileLabels";

import rtiLabels from "./labels/modules/rtiLabels";
import slbLabels from "./labels/modules/slbLabels";
import pabbmLabels from "./labels/modules/pabbmLabels";
import roadExcavationLabels from "./labels/modules/roadExcavation";


let newLabels = {
  //common
  home: homeLabels,
  login: loginLabels,
  dashboard: dashboardlabels,
  CompleteProfile: profileLabels,

  //modules
  townPlanning: tpLabels,
  common: cfcLabels,
  FireBrigadeSystem: fbsLabels,
  streetVendorManagementSystem: hmsLabels,
  LegalCase: lcLabels,
  marriageRegistration: mrLabels,
  grievanceMonitoring: gmLabels,
  municipalSecretariatManagement: msLabels,
  propertyTax: ptaxLabels,
  sportsPortal: spLabels,
  skySignLicense: sslLabels,
  ElectricBillingPayment: ebpLabels,
  BsupNagarvasthi: bsupLabels,
  veterinaryManagementSystem: vmsLabels,
  lms: lmLabels,
  SlumBillingManagementSystem: slumLabels,
  sm: smLabels,
  school: schoolLabels,
  RTIOnlineSystem: rtiLabels,
  Slb: slbLabels,
  PublicAuditorium: pabbmLabels,
  nrms: nrmsLabels,
  roadExcavation: roadExcavationLabels,
};

export default newLabels;
