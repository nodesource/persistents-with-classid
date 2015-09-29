#include <v8.h>
#include <node.h>

using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Handle;
using v8::HandleScope;
using v8::Integer;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Persistent;
using v8::PersistentHandleVisitor;
using v8::Uint32;
using v8::Value;
using v8::V8;

template <class TypeName>
inline Local<TypeName> PersistentToLocal(Isolate* isolate,
                                         const Persistent<TypeName>* pst) {
  if (pst->IsWeak()) {
    return Local<TypeName>::New(isolate, *pst);
  } else {
    return *reinterpret_cast<Local<TypeName>*>(
        const_cast<Persistent<TypeName>*>(pst));
  }
}

class PersistentHandleWithClassIdVisitor : public PersistentHandleVisitor {
  public:
    PersistentHandleWithClassIdVisitor(Isolate* isolate,
                                       Local<Function> fn,
                                       uint32_t ids)
        : ids_(ids) {
      fn_p_.Reset(isolate, fn);
    };

    ~PersistentHandleWithClassIdVisitor() {
      fn_p_.Reset();
    }

    virtual void VisitPersistentHandle(Persistent<Value>* value,
                                       uint16_t class_id) {
      Isolate* isolate = Isolate::GetCurrent();
      HandleScope handle_scope(isolate);
      Local<Function> fn = PersistentToLocal(isolate, &fn_p_).As<Function>();

      // class_id adjustment for AsyncWrap
      if (class_id >= 0xA1C && class_id < 0xA1C + 100)
        class_id = class_id - 0xA1C;

      if (!((class_id << 1) && ids_))
        return;

      Local<Value> obj = PersistentToLocal(isolate, value);

      if (obj.IsEmpty())
        return;

      Local<Value> argv[] = {
        Integer::New(isolate, class_id),
        obj
      };

      fn->Call(Null(Isolate::GetCurrent()), 2, argv);
    }

  private:
    Persistent<Function> fn_p_;
    const uint32_t ids_;
};

static void Visit(const FunctionCallbackInfo<Value>& info) {
  Isolate* isolate = info.GetIsolate();

  assert(info[0]->IsFunction());
  assert(info[1]->IsUint32());

  PersistentHandleWithClassIdVisitor visitor(isolate,
                                             info[0].As<Function>(),
                                             info[1]->Uint32Value());
  V8::VisitHandlesWithClassIds(isolate, &visitor);
}

static void InitVisitor(Handle<Object> exports) {
  NODE_SET_METHOD(exports, "visit", Visit);
}

NODE_MODULE(persistents_with_classid, InitVisitor)
