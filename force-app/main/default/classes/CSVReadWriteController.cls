public with sharing class CSVReadWriteController {

    @auraenabled
    public static void csvHandler(List<list<String>> csvData){
          system.debug('>>>>>>>csvRows : '+csvData);
         Integer countRow=-1;
        for(List<String> rowdata :csvData ){
            countRow++;
            if(String.isNotBlank(rowdata.get(5))){
                 list<String> strList=(String.valueOf(rowdata.get(5)).split('-'));
                 system.debug(strList);
             for(string str:strList){
             }
            }
             if(countRow==2){
                 break;
             }   
            }
    }
}