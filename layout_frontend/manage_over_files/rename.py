import sys  
import os  
def name(args):  
    files=os.listdir(args)  
    print('input:'+args)  
    for file in files:
        if '.下载' in file:
            print(file)
            print(file[:-3])
            os.rename(file, file[:-3])
        # print(file+'-->'+a)  
        # #print(args+file)  
        # os.rename(args+file,args+a)  
  
if __name__ == '__main__':  
    name(sys.argv[1])  