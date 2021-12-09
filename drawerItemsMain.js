export const drawerItemsMain = [
  {
    key: 'Mainmenu1',
    title: 'คำถามที่มักถามประจำ',
    routes: [
      { nav: 'ShowInCome', routeName: 'ShowInCome', title: 'ยอดขายตามปีเดือน' },
      { nav: 'ShowInComeTeam', routeName: 'ShowInComeTeam', title: 'ยอดขายตามทีมขาย' },
      { nav: 'ShowBank', routeName: 'ShowBank', title: 'ยอดเงินในธนาคาร' },
      { nav: 'ShowSellBook', routeName: 'ShowSellBook', title: 'แสดงยอดซื้อขายรายวัน' },
      { nav: 'ShowPayMentdeposit', routeName: 'ShowPayMentdeposit', title: 'แสดงยอดรับจ่ายชำระรายวัน' },
      { nav: 'CurrentStatus', routeName: 'CurrentStatus', title: 'สรุปสถานภาพปัจจุบัน' },
    ],
  },
  {
    key: 'Mainmenu2',
    title: 'ยอดลูกหนี้แต่ละราย',
    routes: [
      { nav: 'ShowAR', routeName: 'AR_SellAmount', title: 'แสดงยอดขายแต่ละเดือน' },
      { nav: 'ShowAR', routeName: 'AR_ShowArdetail', title: 'แสดงยอดหนี้คงค้าง' },
      { nav: 'ShowAR', routeName: 'AR_SellAmountByIcDept', title: 'แสดงยอดขายตามหมวดสินค้า' },
      { nav: 'ShowAR', routeName: 'AR_GoodsBooking', title: 'แสดงสินค้าจองค้างส่ง' },
      { nav: 'ShowAR', routeName: 'AR_Address', title: 'แสดงที่อยู่' },
    ],
  },
  {
    key: 'Mainmenu3',
    title: 'ยอดเจ้าหนี้แต่ละราย',
    routes: [
      { nav: 'ShowAP', routeName: 'AP_PurcAmount', title: 'แสดงยอดซื้อแต่ละเดือน' },
      { nav: 'ShowAP', routeName: 'AP_ShowArdetail', title: 'แสดงยอดหนี้คงค้าง' },
      { nav: 'ShowAP', routeName: 'AP_PurcAmountByIcDept', title: 'แสดงยอดซื้อตามหมวดสินค้า' },
      { nav: 'ShowAP', routeName: 'AP_GoodsBooking', title: 'แสดงสินค้าสั่งซื้อค้างรับ' },
      { nav: 'ShowAP', routeName: 'AP_Address', title: 'แสดงที่อยู่' },
    ],
  },
  {
    key: 'Mainmenu4',
    title: 'สรุปยอดเช็คและสินค้าคงเหลือ',
    routes: [
      { nav: 'ChequeIn', routeName: 'ChequeIn', title: 'ยอดเช็ครับครบแต่ละเดือน' },
      { nav: 'ChequeBook', routeName: 'ChequeBook', title: 'ยอดเช็คจ่ายครบแต่ละเดือน' },
      { nav: 'SkuBalance', routeName: 'SkuBalance', title: 'ยอดสินค้าคงเหลือตามหมวด' },
      { nav: 'SkuBalanceByWL', routeName: 'SkuBalanceByWL', title: 'ยอดสินค้าคงเหลือตามตำแหน่งเก็บ' },

    ],
  },
  {
    key: 'Mainmenu5',
    title: 'สรุปยอดลูกหนี้-เจ้าหนี้',
    routes: [
      { nav: 'ShowAR', routeName: 'ArDueDate', title: 'สรุปยอดลูกหนี้ครบกำหนดตามปีเดือน' },
      { nav: 'Arcat', routeName: 'Arcat', title: 'สรุปยอดลูกหนี้ตามประเภทลูกหนี้' },
      { nav: 'ShowAP', routeName: 'ApDueDate', title: 'สรุปยอดเจ้าหนี้ครบกำหนดตามปีเดือน' },
      { nav: 'Apcat', routeName: 'Apcat', title: 'สรุปยอดเจ้าหนี้ตามประเภทเจ้าหนี้' },
    ],
  },
  {
    key: 'Mainmenu6',
    title: 'ติดตามยอดขาย',
    routes: [
      { nav: 'IncomeBySlmn', routeName: 'IncomeBySlmn', title: 'สรุปยอดขายตามพนักงานขาย' },
      { nav: 'IncomeByPos', routeName: 'IncomeByPos', title: 'สรุปยอดขายตามเครื่องบันทึกเงินสด' },
      { nav: 'ShowSlmn', routeName: 'SlmnByYearMonth', title: 'แสดงยอดพนักงานขายแต่ละเดือน' },
      { nav: 'ShowPos', routeName: 'PosByYearMonth', title: 'แสดงยอดเครื่องบันทึกเงินสด' },
    ],
  },
];
